module Api
  module V1
    class BooksController < ApplicationController
      before_action :authenticate_user!
      before_action :authorize_librarian!, only: [:create, :update, :destroy]

      def index
        books = if params[:q]
                  q = "%#{params[:q]}%"
                  Book.where("title ILIKE ? OR author ILIKE ? OR genre ILIKE ?", q, q, q)
                else
                  Book.all
                end
        render json: books
      end

      def create
        book = Book.new(book_params)
        if book.save
          render json: book, status: :created
        else
          render json: { errors: book.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        book = Book.find(params[:id])
        if book.update(book_params)
          render json: book
        else
          render json: { errors: book.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        Book.find(params[:id]).destroy
        head :no_content
      end

      private

      def book_params
        params.require(:book).permit(:title, :author, :genre, :isbn, :total_copies, :available_copies)
      end

      def authorize_librarian!
        head :forbidden unless current_user.librarian?
      end
    end
  end
end
