module Api
  module V1
    class DashboardController < ApplicationController
      before_action :authenticate_user!

      def show
        if current_user.librarian?
          render json: librarian_dashboard
        else
          render json: member_dashboard
        end
      end

      private

      def librarian_dashboard
        today = Date.current
        {
          total_books: Book.count,
          borrowed_books: Borrowing.where(returned_at: nil).count,
          due_today: Borrowing.where(returned_at: nil, due_at: today.all_day).count,
          overdue_members: User
            .joins(:borrowings)
            .where(role: :member)
            .where("borrowings.returned_at IS NULL AND borrowings.due_at < ?", today)
            .distinct
            .pluck(:email)
        }
      end

      def member_dashboard
        active = current_user.borrowings.where(returned_at: nil)
        overdue = active.where("due_at < ?", Date.current)
        {
          borrowed_count: active.count,
          overdue_count: overdue.count,
          due_dates: active.order(:due_at).pluck(:id, :due_at)
        }
      end
    end
  end
end
