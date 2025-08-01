require 'rails_helper'

RSpec.describe "API::V1::Users::Registrations", type: :request do
  describe "POST /api/v1/users" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          user: {
            email: "test@example.com",
            password: "password123",
            password_confirmation: "password123",
            role: "member"
          }
        }
      end

      it "creates a new user" do
        expect {
          post "/api/v1/users", params: valid_params, as: :json
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["email"]).to eq("test@example.com")
      end
    end

    context "with invalid parameters" do
      it "returns error for missing email" do
        post "/api/v1/users", params: {
          user: { email: "", password: "123", password_confirmation: "123" }
        }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"]).to be_present
      end
    end
  end
end
