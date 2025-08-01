class MakeBookFieldsNotNull < ActiveRecord::Migration[7.1]
  def change
    change_column_null :books, :title, false
    change_column_null :books, :author, false
    change_column_null :books, :genre, false
    change_column_null :books, :isbn, false
    change_column_null :books, :total_copies, false
  end
end
