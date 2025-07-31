module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_user!

      def current
        render json: {
          id: current_user.id,
          email: current_user.email,
          role: current_user.role
        }
      end
    end
  end
end
