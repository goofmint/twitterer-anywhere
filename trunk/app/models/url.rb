class Url < ActiveRecord::Base
  has_many :messages
  
  def get_messages(lang = "en")
    update = nil
    [self.url, self.tinyurl].each { |u|
      if lang == "en"
        str = "http://search.twitter.com/search.json?q=#{u}"
      else
        str = "http://pcod.no-ip.org/yats/search?query=#{u}&json"
      end
      begin
        json = open(str).read
        ary  = JSON.parse(json)
        ary = ary["results"] if lang == "en"
        ary.each { |i|
          url = i["url"]
          if lang == "en"
            url = "http://twitter.com/#{i["from_user"]}/statuses/#{i["id"]}"
          end
          if self.messages.count(:conditions => ['user_url = ?', url]) == 0
            if lang == "en"
              self.messages << Message.new(:user_url => url, :time_at => i["created_at"], :content => i["text"], :user => i["from_user"])
            else
              self.messages << Message.new(:user_url => i["url"], :time_at => i["time2"], :content => i["content"], :user => i["user"])
            end
            update = true
          end
        }
      rescue
      end
    }
    if update
      self.count = self.count - 1 unless self.count == 0
      self.lastupdate_at = Time.now
    else
      self.count = self.count + 1 unless self.count >= 1000
    end
    self.nextcheck_at  = Time.now + (self.count ^ 2).minutes
    self.save
  end
end
