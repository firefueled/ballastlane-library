module Api
  module V1
    class BorrowingsController < ApplicationController
      before_action :authenticate_user!

      def create
        book = Book.find(params[:book_id])
        borrowing = Borrowing.new(user: current_user, book: book)

        if borrowing.save
          render json: borrowing, status: :created
        else
          render json: { errors: borrowing.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        borrowing = Borrowing.find(params[:id])
        unless current_user.librarian?
          return head :forbidden
        end

        if borrowing.update(returned_at: Time.current)
          render json: borrowing
        else
          render json: { errors: borrowing.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
