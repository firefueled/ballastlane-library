require "rails_helper"
require "support/auth_helpers"

RSpec.describe "Api::V1::Sessions", type: :request do
  include AuthHelpers

  let(:librarian) { User.create!(email: "lib@example.com", password: "password", role: :librarian) }
  let(:member)    { User.create!(email: "mem@example.com", password: "password", role: :member) }

  describe "GET /api/v1/users/current" do
    it "returns current user info for librarian" do
      headers = login_headers(librarian)

      get "/api/v1/users/current", headers: headers
      expect(response).to have_http_status(:ok)

      data = JSON.parse(response.body)
      expect(data["email"]).to eq("lib@example.com")
      expect(data["role"]).to eq("librarian")
    end

    it "returns current user info for member" do
      headers = login_headers(member)

      get "/api/v1/users/current", headers: headers
      expect(response).to have_http_status(:ok)

      data = JSON.parse(response.body)
      expect(data["email"]).to eq("mem@example.com")
      expect(data["role"]).to eq("member")
    end

    it "returns unauthorized without login" do
      get "/api/v1/users/current"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
