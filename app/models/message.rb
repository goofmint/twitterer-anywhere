class Message < ActiveRecord::Base
  belongs_to :url
  def no_url_content
    self.content.sub(self.url.url+"/", "").sub(self.url.url, "").sub(self.url.tinyurl, "")
  end
end
