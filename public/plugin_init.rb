Plugins::add_record_page_action_erb(['resource', 'archival_object'], 'shared/contact_us', 0)
Rails.application.config.after_initialize do
  class WelcomeController < ApplicationController
    def show
     @page_title = I18n.t 'brand.welcome_page_title'
     @fa_counts = archivesspace.get_types_counts('pui_collection')
     @search = Search.new(params)
     render
    end
  end
end