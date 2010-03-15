LAWNCHAIR_DIR = File.expand_path(File.join(ENV['HOME'], 'ruboss/clients/worksafe/lawnchair/src'))

namespace :lawnchair do

  desc "copy the lawnchair JS files in"
  task :install do
    `rm -rf javascripts/Lawnchair.js`
    `rm -rf javascripts/adaptors`
    `cp -r #{File.join(LAWNCHAIR_DIR, '*')} javascripts`
  end
  
end