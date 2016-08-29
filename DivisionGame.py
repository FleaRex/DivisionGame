

class Game(object):
   def  __init__(self, board):
        self.board = board

class Board(object):
    def __init__(self, matrix):
        self.grid = matrix
        

# class Tile(object):
#     def __init__(self, number):
#         self.number = number
    

class Frog(object):
    def __init__(self, number):
        self.number = number
        
    def find_route(self, board, start_i, start_j):
        pass