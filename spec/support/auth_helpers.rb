module AuthHelpers
  def login_headers(user)
    post user_session_path,
         params: { user: { email: user.email, password: "password" } },
         headers: { "Accept" => "application/json" }

    { "Authorization" => response.headers["Authorization"] }
  end
end
