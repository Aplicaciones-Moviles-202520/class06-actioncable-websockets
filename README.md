# Ejemplo Clase 6: Aplicaciones Móviles Colaborativas

## Introducción

En este ejemplo de clases veremos una aplicación móvil colaborativa para participación síncrona, enfocada en la discusión basada en preguntas. El usuario crea una sala de discusión con un cierto nombre, y otros usuarios se pueden unir a discutir la pregunta de la sala. Finalmente, los usuarios deben escoger (votar por) una decisión o respuesta en relación a la pregunta planteada. Si los usuarios no están de acuerdo, el sistema se los comunica y deben continuar la discusión. En caso contrario, el sistema comunica a los usuarios la respuesta de consenso.

El patrón de colaboración anterior corresponde a un micro-guión (_microscript_) de aprendizaje colaborativo (Dillenbourg & Hong, 2008) desarrollado por Cortez et al. (2005), y que luego el profesor de este curso junto con Miguel Nussbaum (Nussbaum et al., 2009) extendieron para hacer que las alternativas en votación fueran construidas por los propios participantes (y no fueran dadas o pre-establecidas). Este _microscript_ ha sido inspiración para muchos desarrollos posteriores en el área de _Computer-Supported Collaborative Learning_ (CSCL).

El _microscript_ cumple con ciertas condiciones para una colaboración efectiva:

1. **Hay un objetivo común:** Alcanzar el consenso grupal, con previa discusión de las distintas aristas o aspectos relevantes de la pregunta según los participantes.
2. **Existe interdependencia positiva:** Las contribuciones de los participantes son relevantes, pues el grupo no puede avanzar a menos que cada participante realice su contribución (emita su voto). Si un participante no discute y vota distinto al resto, se verá forzado por el resto a clarificar su postura. Así, la regulación social surge en forma natural y el grupo se mantiene en el proceso de alcanzar un consenso.
3. **Existe una recompensa compartida:** Los colaboradores participan en la actividad ya sea en un contexto de informalidad e intrínsecamente motivados por encontrar respuesta a una determinada pregunta, o porque realizan la actividad en un contexto formal de aprendizaje o trabajo. Cualquiera sea el caso, resolver las diferencias y alcanzar un consenso es una recompensa que puede animar a los participantes a continuar discutiendo otras preguntas.
4. **Coordinación y comunicación:** El sistema permite que los participantes puedan comunicarse en forma síncrona a través de chat, y provee un nivel de coordinación básico para efectos de la votación. 
5. **_Awareness_:** La comunicación a través de chat permite a los participantes estar conscientes sobre las decisiones de cada uno. Sin embargo, el proceso de votación podría mejorar, por ejemplo, dando a cada participante visibilidad de la cantidad de votos que han sido emitidos. Por otro lado, mientras un participante vota no está poniendo atención a lo que se discute por chat. En este sentido, una mejora básica de awareness podría consistir en poner en la pestaña de Chat una indicación sobre la cantidad de mensajes no leídos.
6. **Responsabilidad individual:** Cada individuo es responsable por sus posturas y decisiones, así como también de participar activamente en la discusión para que el grupo pueda avanzar hacia el cumplimiento del objetivo.

**Bibliografía**

Cortez, C., Nussbaum, M., López, X., Rodríguez, P., Santelices, R., Rosas, R., & Marianov, V. (2005). Teachers' support with ad‐hoc collaborative networks. _Journal of Computer Assisted Learning_, 21(3), 171-180. [https://onlinelibrary.wiley.com/doi/full/10.1111/j.1365-2729.2005.00125.x](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1365-2729.2005.00125.x)

Dillenbourg, P., & Hong, F. (2008). The mechanics of CSCL macro scripts. _International Journal of Computer-Supported Collaborative Learning_, 3, 5-23. [https://link.springer.com/article/10.1007/s11412-007-9033-1](https://link.springer.com/article/10.1007/s11412-007-9033-1)

Nussbaum, M., Alvarez, C., McFarlane, A., Gomez, F., Claro, S., & Radovic, D. (2009). Technology as small group face-to-face collaborative scaffolding. _Computers & Education_, 52(1), 147-153. [https://doi.org/10.1016/j.compedu.2008.07.005](https://doi.org/10.1016/j.compedu.2008.07.005)

## Implementación de la Aplicación

Esta aplicación consta de un backend desarrollado con Rails 7, y un frontend con React 18. El backend implementa una API que administra los siguientes recursos:

* `User`: El usuario participante en la sala de discusión.
* `Room`: Sala de discusión.
* `RoomPresence`: Vincula un usuario con una sala de discusión. Un usuario puede estar en una sola sala en el sistema a la vez.
* `Question`: Pregunta para discusión.
* `Choice`: Alternativa para respuesta a una pregunta de la discusión.
* `QuestionInstance`: Instancia de una pregunta en una sala de discusión.
* `Message`: Un mensaje enviado por el usuario (o por el Sistema) a la sala de discusión.
* `VoteRound`: Una ronda de votación en la sala.
* `ChoiceVote`: El voto por una alternativa de un usuario en una ronda de votación.

Las preguntas de discusión y sus alternativas se encuentran definidas en las seeds de la aplicación (`db/seeds.rb`). Se carga contenido desde `test/fixtures` para estos elementos.

Para las conversaciones, la aplicación utiliza comunicación síncrona a través de web sockets, utilizando el componente de [Action Cable](https://guides.rubyonrails.org/action_cable_overview.html) de Rails. 

Action Cable permite que un servidor maneje múltiples instancias de conexión WebSocket, una por cada conexión. Un usuario puede tener varias conexiones WebSocket abiertas si usa múltiples pestañas o dispositivos. A cada conexión WebSocket se le llama "consumer" (consumidor).

Cada consumidor puede suscribirse a varios canales, que encapsulan unidades lógicas de trabajo, de manera similar a lo que hace un controlador en un entorno MVC. Por ejemplo, podrías tener un canal para el chat y otro para las apariciones. Un consumidor puede suscribirse a uno o varios canales.

Cuando un consumidor está suscrito a un canal, actúa como "_subscriber_" (suscriptor), y la conexión se llama "_subscription_" (suscripción). Un consumidor puede suscribirse varias veces a un canal, como en el caso de un usuario que participe en varias salas de chat a la vez.

Cada canal puede transmitir uno o más "_broadcastings_" (transmisiones), donde cualquier dato enviado por el emisor se distribuye directamente a los suscriptores del canal que están escuchando esa transmisión.

Este esquema presenta una arquitectura profunda con varios niveles y nueva terminología para las piezas involucradas, tanto del lado del cliente como del servidor. En el frontend se utiliza un cliente de action cable que es provisto por el módulo [actioncable](https://www.npmjs.com/package/actioncable).

## API de Backend

La API de backend es implementada por una serie de controladores en `backend/app/controllers/api/v1`:

* `RoomsController`: Provee _endpoints_ para las operaciones de listado, acceso y creación de salas de discusión.
* `UsersController`: Provee _endpoints_ para las operaciones de creación de usuarios.
* `VotesController`: Implementa los _endpoints_ para la funcionalidad de votación. Incluye la implementación de la función `check_all_voted`, pieza fundamental de la aplicación que permite implementar la lógica del sistema de votación (el _microscript_ descrito arriba). Utiliza Action Cable para la comunicación del sistema a los participantes del proceso de discusión y votación.
* `MessagesController`: Implementa los _endpoints_ para las operaciones de mensajería por chat. Utiliza Action Cable para la comunicación síncrona de los mensajes a los participantes.

La implementación de la funcionalidad de canales de Action Cable es posible a través de la definición de canal para sala de discusión en `backend/app/channels/room_channel.rb`.

```ruby
class RoomChannel < ApplicationCable::Channel
  def subscribed
    # Los usuarios se suscriben a un stream específico de la sala
    stream_from "room_#{params[:room_id]}"
  end

  def unsubscribed
    # Cualquier cleanup si es necesario al desconectarse
  end
end
```

## Aplicación de Frontend

La aplicación de frontend desarrollada en React utiliza [Chakra UI](https://v2.chakra-ui.com/) como biblioteca de componentes de interfaz de usuario. Chakra ofrece componentes altamente personalizables - más personalizables que los de MUI -, sin embargo, a expensas del desempeño de la renderización. Para aplicaciones pequeñas y medianas, Chakra es una excelente solución para React y alternativa a MUI.

Los componentes de la aplicación React son los siguientes:

* `App`: Componente principal integrador de la aplicación de frontend.
* `WelcomeDialog`: Permite al usuario ingresar a la aplicación con un pseudónimo (_nickname_).
* `RoomsDialog`: Permite al usuario crear una sala de discusión o unirse a una nueva sala.
* `RoomWorkspace`: Integra las funciones de discusión dadas por el componente `ChatRoom`, y las funciones de votación dadas por el componente `VoteDialog`.
* `ChatRoom`: Implementa la sala de discusión y puede verse en éste cómo se utiliza Action Cable para la comunicación de mensajes.
* `VoteDialog`: Provee la funcionalidad necesaria para votar por alguna de las alternativas asociadas a la pregunta en discusión.

## Iniciar la aplicación

La aplicación de backend en Rails está configurada para usar operar en localhost en puerto 3001 con coors permisivo para permitir conexiones desde el frontend, también en localhost.

Se deben iniciar manualmente ambas aplicaciones:

```sh
rails db:setup
rails s
```

Luego el frontend:

```sh
yarn dev
```

La aplicación de frontend es accesible desde [http://localhost:5173](http://localhost:5173).

## Desafíos para extender la aplicación

Se pueden considerar las siguientes alternativas para continuar el desarrollo de esta aplicación y potenciarla para su uso práctico:

1. Mejorar la _awareness_, mostrando al usuario en las rondas de votación un contador de votos emitidos.
2. Mejorar la _awareness_ cuando todos han votado y llegado a acuerdo. Por ejemplo, el fondo podría cambiar a un color verde pastel por unos segundos y luego hacer _fade to white_ (volver progresivamente al blanco).
3. Mejorar la _awareness_ cuando todos han votado y están en desacuerdo. Por ejemplo, el fondo podría cambiar a un color rojo claro/pastel por unos segundos y luego hacer _fade to white_ (volver progresivamente al blanco).
4. Cuando el usuario está en la pestaña de votación, mostrar en la pestaña de chat cuántos mensajes han entrado desde que el usuario ha cambiado su foco de atención a la pestaña de votación.
5. Implementar un proceso de discusión y votación en dos fases. Antes de la primera ronda de votación, se establece una fase tal que cada usuario propone una respuesta a la pregunta (alternativa). Una vez que todos los usuarios han propuesto una alternativa, las alternativas son presentadas en rondas sucesivas para votación. Así se dejan de usar las alternativas predefinidas y en su lugar alternativas generadas por los usuarios (Nussbaum et al., 2009). Para efectos de integrar esta nueva funcionalidad, y preservar la funcionalidad ya existente, al momento de crear la sala de discusión se podría dar al usuario la posibilidad de usar las alternativas predefinidas, o que los usuarios generen las alternativas de votación.