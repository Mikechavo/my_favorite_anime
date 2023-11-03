class JjkController < ApplicationController
  def index
    @top_left_gutter = 'jjk/goblinslayer'

    render layout: 'unified'
  end
end
