import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GameScreen = ({ route }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [history, setHistory] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const navigation = useNavigation();

  useEffect(() => {
    if (winner) {
      Alert.alert('We have a winner!', `Player ${winner} wins!`);
      updateScores(winner);
      saveResult(winner, winner === 'X' ? 'O' : 'X');
      resetBoard();
    }
  }, [winner]);

  useEffect(() => {
    if (route.params && route.params.history) {
      setHistory(route.params.history);
    }
  }, [route.params]);

  const handlePress = (index) => {
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setHistory([...history, { board: newBoard, player: currentPlayer }]);

    const { newWinner, winningCells } = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setWinningCells(winningCells);
    } else if (newBoard.every(cell => cell !== null)) {
      Alert.alert('It\'s a draw!');
      setScores(prevScores => ({ ...prevScores, draws: prevScores.draws + 1 }));
      saveResult(null, null, true);
      resetBoard();
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { newWinner: board[a], winningCells: [a, b, c] };
      }
    }

    return { newWinner: null, winningCells: [] };
  };

  const updateScores = (winner) => {
    setScores(prevScores => ({
      ...prevScores,
      [winner]: prevScores[winner] + 1,
    }));
  };

  const saveResult = (winner, loser, isDraw = false) => {
    const newHistory = [...history, { winner, loser, isDraw }];
    setHistory(newHistory);

    // Navigate to HistoryScreen and pass history data
    navigation.navigate('History', { history: newHistory });
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCells([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const lastMove = history.pop();
    setBoard(lastMove.board);
    setCurrentPlayer(lastMove.player);
    setWinner(null);
    setWinningCells([]);
  };

  const Cell = ({ value, onPress, isWinningCell }) => {
    const [blinkAnim] = useState(new Animated.Value(1));

    useEffect(() => {
      if (isWinningCell && winner) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(blinkAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(blinkAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }, [isWinningCell, winner]);

    const cellColor = value === 'X' ? '#add8e6' : value === 'O' ? '#90ee90' : '#fff';

    return (
      <TouchableOpacity onPress={onPress} style={[styles.cell, { backgroundColor: cellColor }]}>
        <Animated.Text style={[
          styles.cellText,
          value === 'X' ? styles.xText : styles.oText,
          isWinningCell && { opacity: blinkAnim }
        ]}>
          {value}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tic Tac Toe</Text>
      <View style={styles.board}>
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onPress={() => handlePress(index)}
            isWinningCell={winningCells.includes(index)}
          />
        ))}
      </View>
      <View style={styles.scoresContainer}>
        {/* <Text style={styles.scoreText}>Player X Wins: {scores.X}</Text>
        <Text style={styles.scoreText}>Player O Wins: {scores.O}</Text>
        <Text style={styles.scoreText}>Draws: {scores.draws}</Text> */}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={resetBoard}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleUndo}>
          <Text style={styles.buttonText}>Undo Move</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    
  },
  cell: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius:15
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  xText: {
    color: '#0000FF', // X text color
  },
  oText: {
    color: '#FF0000', // O text color
  },
  scoresContainer: {
    marginVertical: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#6200EF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GameScreen;
