Rails.application.routes.draw do
  get '/jjk', to: 'jjk#index'
  root to: 'jjk#index'

  get '/goblin_slayer', to: 'goblin_slayer#show', as: 'goblin_slayer_details'

  get '/berserk', to: 'berserk#show', as: 'berserk_details'

  get '/show', to: 'jjk#show', as: 'jjk_details'

  
end
