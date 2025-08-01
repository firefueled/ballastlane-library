class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  protect_from_forgery with: :null_session

  before_action :configure_permitted_parameters, if: :devise_controller?
  respond_to :json

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email])
  end

  def authenticate_user!
    unless user_signed_in?
      respond_to do |format|
        format.json { render json: { error: "Unauthorized" }, status: :unauthorized }
        format.html { super } # fallback to default Devise behavior
      end
    else
      super
    end
  end
end
