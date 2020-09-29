ArchivesSpacePublic::Application.routes.draw do
	scope format: false do
	get '/xtf/data/ead/:file', to: redirect('/assets/ead/%{file}')
	end
end
