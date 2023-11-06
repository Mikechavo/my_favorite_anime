Rails.application.routes.draw do
  # get '/', to: 'jjk#index'
  # root to: 'jjk#index'

  get '/goblin_slayer', to: 'goblin_slayer#show', as: 'goblin_slayer_details'
  
end
