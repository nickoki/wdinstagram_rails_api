Rails.application.routes.draw do
  resources :entries

  root to: 'posts#index'

end
