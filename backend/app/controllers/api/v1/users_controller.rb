# app/controllers/api/v1/users_controller.rb
module API
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: [:show]

      # GET /api/v1/users/:id
      def show
        render json: @user
      end

      # POST /api/v1/users
      def create
        @user = User.new(user_params)
        if @user.save
          render json: @user, status: :created
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(:nickname)
      end
    end
  end
end
