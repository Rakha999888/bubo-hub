const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

class SimpleCopyPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('SimpleCopyPlugin', (compilation) => {
      const outputPath = compiler.options.output.path;
      const files = ['manifest.json', 'icon.svg', 'sw.js', 'presiden_prabowo.jpg', 'wapres_gibran.jpg'];
      files.forEach((file) => {
        const src = path.resolve(__dirname, 'public', file);
        const dest = path.resolve(outputPath, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      });
    });
  }
}

module.exports = {
  entry: './src/index.tsx',
  output: { path: path.resolve(__dirname, 'dist'), filename: '[name].[contenthash].js', publicPath: '', clean: true },
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
    new SimpleCopyPlugin(),
    // Set HERMES_WS_URL=ws://host:port/agents to use a real Hermes AgentOS socket.
    new webpack.DefinePlugin({ 'process.env.HERMES_WS_URL': JSON.stringify(process.env.HERMES_WS_URL || '') })
  ],
  devServer: { port: 3000, hot: true, open: true },
  performance: { hints: false }
};
