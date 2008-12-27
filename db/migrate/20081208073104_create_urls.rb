class CreateUrls < ActiveRecord::Migration
  def self.up
    create_table :urls do |t|
      t.text :url, :tinyurl, :blank => false
      t.integer :count, :default => 0
      t.timestamp :lastupdate_at, :nextcheck_at
      t.timestamps
    end
  end

  def self.down
    drop_table :urls
  end
end
