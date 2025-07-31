class Book < ApplicationRecord
  has_many :borrowings, dependent: :destroy

  validates :title, :author, :total_copies, presence: true
  validates :isbn, uniqueness: true, allow_blank: true

  before_create :set_available_copies

  def available?
    available_copies > 0
  end

  private

  def set_available_copies
    self.available_copies ||= total_copies
  end
end
