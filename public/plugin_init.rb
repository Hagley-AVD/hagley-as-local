Plugins::add_record_page_action_erb(['resource', 'archival_object'], 'shared/contact_us', 0)
Plugins::extend_aspace_routes(File.join(File.dirname(__FILE__), "routes.rb"))
