require "test_helper"

class JjkControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get jjk_index_url
    assert_response :success
  end
end
