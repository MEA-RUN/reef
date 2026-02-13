# Match the Shape - Interactive Python Learning Game

## Overview

**Match the Shape** is an interactive educational tool designed to teach Python programming fundamentals through a visual, game-based approach. Players control shapes on a grid using Python code, learning core programming concepts while solving puzzles.

## Features

- **Visual Programming**: See your code come to life on a grid-based canvas
- **Progressive Difficulty**: Start with 1 shape, progress to 4 shapes
- **Python Powered**: Uses Pyodide to run real Python code in the browser
- **Method Chaining**: Learn advanced Python patterns
- **Immediate Feedback**: See results instantly as code executes

## How to Play

1. **Create Shapes**: Define shapes using Python classes
   ```python
   s = shape.Square("red")
   c = shape.Circle("blue")
   ```

2. **Position Shapes**: Place them on the grid
   ```python
   s.set_position(2, 3)
   ```

3. **Move to Destinations**: Use movement commands to reach outlined destinations
   ```python
   s.forward(2)
   s.right()
   s.forward(1)
   ```

4. **Win**: Get all shapes to their destinations!

## Learning Objectives

### Core Concepts
- **Variables**: Storing and naming objects
- **Objects**: Understanding object-oriented programming
- **Methods**: Calling functions on objects
- **Sequences**: Understanding execution order
- **Method Chaining**: Combining multiple operations

### Programming Skills
- Syntax understanding
- Spatial reasoning
- Problem decomposition
- Sequential thinking
- Debugging

## Files

- `index.html` - Main game interface
- `match_the_shape.py` - Python game engine (runs via Pyodide)
- `GUIDE_TUTORIEL_COURT.md` - Quick reference guide (French)
- `metadata.json` - Tool metadata and configuration

## Technical Details

### Dependencies
- **Pyodide**: Python runtime for the browser
- **HTML5 Canvas**: Visual rendering
- **JavaScript**: Game coordination

### Browser Requirements
- Modern browser with JavaScript enabled
- WebAssembly support for Pyodide
- Minimum 2GB RAM recommended

## Game Rules

1. Maximum 4 shapes allowed
2. No duplicate shapes (same type + same color)
3. Destinations appear automatically when shapes are positioned
4. All 4 shapes must reach their destinations to win

### Shape Types
- Square
- Circle
- Triangle

### Available Colors
- red
- blue
- green
- yellow
- purple
- orange

## Commands Reference

### Creation
```python
s = shape.Square("red")
c = shape.Circle("blue")
t = shape.Triangle("green")
```

### Positioning
```python
s.set_position(x, y)  # Place at grid coordinates
s.get_position()       # Get current position
```

### Movement
```python
s.forward(n)   # Move n spaces forward
s.backward(n)  # Move n spaces backward
s.left()       # Rotate 90° left
s.right()      # Rotate 90° right
```

### Information
```python
shape_entities  # List all created shapes
```

## Progressive Difficulty

### Level 1 (1 Shape)
- Destination on same line/column
- Learn basic movement

### Level 2 (2 Shapes)
- Destinations within 2 spaces
- Introduction to multiple objects

### Level 3-4 (3-4 Shapes)
- Destinations 3+ spaces away
- Complex path planning
- Multiple object coordination

## Tips for Students

1. Start with one shape to learn the basics
2. Plan your path before coding
3. Use method chaining for efficient code
4. Remember to rotate before moving in a new direction
5. Check `shape_entities` to see all your shapes

## Tips for Teachers

- Encourage students to draw the grid on paper first
- Discuss the concept of coordinate systems
- Use as introduction to object-oriented programming
- Connect movement commands to real-world directions
- Emphasize the importance of sequence in programming

## Common Pitfalls

### ❌ Duplicate Shapes
```python
# Wrong: Two blue circles
c1 = shape.Circle("blue")
c2 = shape.Circle("blue")
```

### ✅ Unique Shapes
```python
# Correct: Different colors
c1 = shape.Circle("blue")
c2 = shape.Circle("green")
```

### ⚠️ Avoid Infinite Loops
```python
# This will freeze your browser!
while True:
    s.forward(1)
```

## Integration

This tool can be embedded in any web page via iframe:

```html
<iframe src="/tools/match/index.html" width="100%" height="600px"></iframe>
```

## License

Part of the Manta educational platform.

## Support

For issues or questions, refer to the main documentation or contact support.

---

**Version**: 1.0.0  
**Category**: Interactive Learning  
**Language**: Python  
**Platform**: Web (Pyodide)
