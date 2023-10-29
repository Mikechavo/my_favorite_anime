Rails.application.routes.draw do
  get '/', to: 'jjk#index'
  root to: 'jjk#index'
  get '/:id' => 'jjk#show' 
end
