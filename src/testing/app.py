from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)

class TicTacToe:
    def __init__(self):
        self.board = [' ' for _ in range(9)]
        self.current_player = 'X'
        self.winner = None
        self.game_over = False
        
    def make_move(self, position):
        if self.game_over or self.board[position] != ' ':
            return False
            
        self.board[position] = self.current_player
        
        if self.check_win():
            self.winner = self.current_player
            self.game_over = True
        elif self.check_draw():
            self.game_over = True
        else:
            self.current_player = 'O' if self.current_player == 'X' else 'X'
            
        return True
    
    def check_win(self):
        win_patterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        
        for pattern in win_patterns:
            a, b, c = pattern
            if self.board[a] != ' ' and self.board[a] == self.board[b] == self.board[c]:
                return True
        return False
    
    def check_draw(self):
        return all(cell != ' ' for cell in self.board)
    
    def get_state(self):
        return {
            'board': self.board,
            'current_player': self.current_player,
            'winner': self.winner,
            'game_over': self.game_over
        }
    
    def reset(self):
        self.__init__()

game = TicTacToe()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/move', methods=['POST'])
def make_move():
    data = request.json
    position = data.get('position')
    
    if position is None or not (0 <= position <= 8):
        return jsonify({'error': 'Invalid position'}), 400
    
    success = game.make_move(position)
    
    if not success:
        return jsonify({'error': 'Invalid move'}), 400
    
    return jsonify(game.get_state())

@app.route('/api/state', methods=['GET'])
def get_state():
    return jsonify(game.get_state())

@app.route('/api/reset', methods=['POST'])
def reset_game():
    game.reset()
    return jsonify(game.get_state())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)