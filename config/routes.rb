Rails.application.routes.draw do
  root to: "articles#index"
  resources :articles, except: :index

  get "up" => "rails/health#show", as: :rails_health_check
end
