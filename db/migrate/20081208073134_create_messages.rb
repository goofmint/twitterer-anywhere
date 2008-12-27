class CreateMessages < ActiveRecord::Migration
  def self.up
    create_table :messages do |t|
      t.string :user_url, :blank => false
      t.timestamp :time_at, :blank => false
      t.text :content
      t.string :user
      t.integer :url_id
      t.timestamps
    end
  end

  def self.down
    drop_table :messages
  end
end
