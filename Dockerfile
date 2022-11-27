FROM ruby:2.6.7-slim-stretch

RUN \
  apt-get update -qq && \
  apt-get install -y gnupg2 && \
  apt-get install curl apt-transport-https -y -qq && \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  curl -sL https://deb.nodesource.com/setup_17.x | bash - && \
  apt-get update -qq -y && \
  apt-get install -y \
  build-essential \
  libpq-dev \
  nodejs \
  yarn \
  && apt-get clean autoclean -y \
  && apt-get autoremove -y

ENV HOME /root

WORKDIR /app

ADD Gemfile Gemfile.lock /app/

RUN \
  gem install bundler && \
  bundle install --jobs 20 --retry 5

ADD . /app/

RUN \
  yarn install --no-cache --frozen-lockfile

ENTRYPOINT ["sh", "entrypoint.sh"]
CMD ["rackup", "-p", "8080", "-o","0.0.0.0"]
