const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  output: { path: path.resolve(__dirname, 'dist'), filename: '[name].[contenthash].js', clean: true },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', options: { transpileOnly: true }, exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(glb|gltf|png|jpg|ktx2)$/, type: 'asset/resource' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    // Set HERMES_WS_URL=ws://host:port/agents to use a real Hermes AgentOS socket.
    new webpack.DefinePlugin({ 'process.env.HERMES_WS_URL': JSON.stringify(process.env.HERMES_WS_URL || '') })
  ],
  devServer: { port: 3000, hot: true, open: true },
  performance: { hints: false }
};
