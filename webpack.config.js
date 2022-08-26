import path from 'path';
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const config = {
  entry: './src/index',
  mode: 'development',
  output: {
    filename: 'index.js',
    path: path.resolve(dirname, './dist'),
    assetModuleFilename: 'assets/img/[name][ext]',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ts$/i,
        use: 'ts-loader'
      },
      {
        test: /\.(mp3|png|jpe?g|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(svg)$/,
        use: 'svg-inline-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(dirname, './src/index.html'),
      filename: 'index.html'
    }),
    // in order to get static icons
    new CopyPlugin({
      patterns: [
        {
          from: './src/assets/img/**/*',
          to({ absoluteFilename }) {
            return absoluteFilename.replace('src', 'dist');
          }
        }
      ]
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({ extensions: 'ts' })
  ],
  devServer: {
    historyApiFallback: true,
    client: {
      overlay: false
    }
  }
};

export default config;
