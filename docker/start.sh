docker build --tag 'vanilla-js-wheel-zoom/image' .
docker run -itd --volume $(pwd)/..:/app --name 'vanilla-js-wheel-zoom' 'vanilla-js-wheel-zoom/image'
docker exec -it --workdir /app 'vanilla-js-wheel-zoom' sh