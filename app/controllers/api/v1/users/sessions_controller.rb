module Api
  module V1
    module Users
      class SessionsController < Devise::SessionsController
        respond_to :json

        before_action :authenticate_user!, only: [:current, :destroy]

        def current
          render json: {
            id: current_user.id,
            email: current_user.email,
            role: current_user.role
          }, status: :ok
        end

        def destroy
          sign_out(current_user)
          head :no_content
        end
      end
    end
  end
end
