class AddMissingIndexes < ActiveRecord::Migration[8.0]
  def change
    add_index :books, :isbn, unique: true

    add_index :borrowings, :due_at
    add_index :borrowings, :returned_at
  end
end
