module Api
  module V1
    class DashboardController < ApplicationController
      before_action :authenticate_user!

      def index
        if current_user.librarian?
          render json: librarian_dashboard
        else
          render json: member_dashboard
        end
      end

      private

      def librarian_dashboard
        {
          total_books: Book.count,
          total_borrowed: Borrowing.where(returned_at: nil).count,
          due_today: Borrowing.where(due_at: Time.zone.today.all_day, returned_at: nil).count,
          overdue_members: Borrowing.includes(:user).where("due_at < ? AND returned_at IS NULL", Time.current).map do |b|
            { user: b.user.email, book: b.book.title, due_at: b.due_at }
          end
        }
      end

      def member_dashboard
        my_borrowings = current_user.borrowings.includes(:book)
        {
          my_books: my_borrowings.map do |b|
            {
              title: b.book.title,
              due_at: b.due_at,
              returned: b.returned?
            }
          end
        }
      end
    end
  end
end
