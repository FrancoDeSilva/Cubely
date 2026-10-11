from rubik_solver import Cube, init_solver, solve


_solver_ready = False


def initialise_solver():

    global _solver_ready

    if not _solver_ready:
        print("Initialising Rubik's Cube solver...")
        init_solver()
        _solver_ready = True
        print("Rubik's Cube solver ready!")


def solve_cube(cube_string: str):

    if not isinstance(cube_string, str):
        raise ValueError("Cube state must be a string.")

    cube_string = cube_string.strip().upper()

    if len(cube_string) != 54:
        raise ValueError(
            f"Cube state must contain exactly 54 stickers. "
            f"Received {len(cube_string)}."
        )

    allowed = set("URFDLB")

    invalid = set(cube_string) - allowed

    if invalid:
        raise ValueError(
            f"Invalid cube characters: {', '.join(sorted(invalid))}"
        )

    cube = Cube.from_string(cube_string)

    # Check whether the cube is physically possible.
    verification = cube.verify()

    if verification is not True:
        raise ValueError(f"Invalid cube: {verification}")

    if cube.is_solved():
        return ""

    solution = solve(cube)

    if solution is None:
        raise ValueError("No solution was found.")

    return solution