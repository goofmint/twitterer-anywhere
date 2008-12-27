require 'json'
require 'open-uri'
class MessageController < ApplicationController
  def index
    urlstring = params[:url].join("/") || ""
    return render(:status => 404, :text => { :error => "URL is require"}.to_json) if urlstring.blank?
    return render(:status => 404, :text => { :error => "URL is invalid"}.to_json) unless URI.parse(urlstring).scheme
    lang = params[:lang] || "en"
    url = Url.find(:first, :conditions => ['url = ?', urlstring])
    unless url
      url = Url.create(:url => urlstring, :tinyurl => "no", :nextcheck_at => Time.now - 1.minute) # first save
    end
    if url.tinyurl == "no"
      tinyurl = "http://tinyurl.com/api-create.php?url=#{urlstring}"
      url.update_attribute :tinyurl, open(tinyurl).read
    end
    
    unless url.nextcheck_at > Time.now
      url.get_messages(lang)
      url.reload
    end
    
    if url.messages.size == 0
      text = "null"
      text = "#{params[:callback]}(#{text})" if params[:callback]
      return render(:status => 200, :text => text)
    end
    
    messages = []
    url.messages.each { |m|
      messages << { :timestamp => m.time_at.strftime("%Y/%m/%d %H:%M:%S"), :comment => m.no_url_content, :user => m.user, :tags => "", :url => m.user_url}
    }
    json = { :count => url.messages.count, :eid => url.id, :entry_url => url.url, 
      :bookmarks => messages
    }
    text = json.to_json
    text = "#{params[:callback]}(#{text})" if params[:callback]
    return render(:status => 200, :text => text)
  end
end
