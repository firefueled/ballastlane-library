class Borrowing < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validate :unique_borrowing_per_user, on: :create
  validate :book_availability, on: :create

  before_create :set_borrow_dates
  after_create :decrement_book
  after_update :increment_book_if_returned

  def returned?
    returned_at.present?
  end

  private

  def unique_borrowing_per_user
    if Borrowing.exists?(user: user, book: book, returned_at: nil)
      errors.add(:base, "You already borrowed this book.")
    end
  end

  def book_availability
    errors.add(:book, "is not available") unless book.available?
  end

  def set_borrow_dates
    self.borrowed_at = Time.current
    self.due_at = 2.weeks.from_now
  end

  def decrement_book
    book.update!(available_copies: book.available_copies - 1)
  end

  def increment_book_if_returned
    if saved_change_to_returned_at? && returned_at.present?
      book.update!(available_copies: book.available_copies + 1)
    end
  end
end
