class Book < ApplicationRecord
  has_many :borrowings, dependent: :destroy

  validates :title, :author, :total_copies, :genre, :isbn, presence: true
  validates :isbn, uniqueness: true
  validates :total_copies, numericality: { greater_than_or_equal_to: 0 }
  validates :available_copies, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  before_create :set_available_copies

  def available?
    available_copies.to_i > 0
  end

  private

  def set_available_copies
    self.available_copies ||= total_copies
  end
end
