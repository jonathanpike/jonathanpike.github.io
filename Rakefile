task :archive do
  puts `bundle exec jekyll build`
  puts `ruby archive/_generator.rb`
  puts "Done!"
end

namespace :assets do
  task :precompile do
    puts `bundle exec jekyll build`
  end
end
