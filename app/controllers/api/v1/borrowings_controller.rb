module Api
  module V1
    class BorrowingsController < ApplicationController
      before_action :authenticate_user!

      def index
        if current_user.librarian?
          render json: Borrowing.includes(:user, :book).all.as_json(include: [:user, :book])
        else
          render json: current_user.borrowings.includes(:book).as_json(include: :book)
        end
      end

      def create
        borrowing = current_user.borrowings.new(book_id: params[:book_id])

        if borrowing.save
          render json: borrowing, status: :created
        else
          render json: { errors: borrowing.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def return
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
