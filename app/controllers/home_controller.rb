class HomeController < ApplicationController
  def index
    @top_left_gutter = 'home/goblinslayer'

    render layout: 'unified'
  end
end
