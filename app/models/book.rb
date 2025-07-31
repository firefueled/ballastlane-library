class Book < ApplicationRecord
  has_many :borrowings, dependent: :destroy

  validates :title, :author, :total_copies, presence: true
  validates :isbn, uniqueness: true, allow_blank: true

  def available?
    available_copies > 0
  end
end
