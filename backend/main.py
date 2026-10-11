from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from cube_converter import faces_to_cube_string
from solver import initialise_solver, solve_cube


@asynccontextmanager
async def lifespan(app: FastAPI):

    # Initialise the solver when the server starts.
    initialise_solver()

    yield


app = FastAPI(
    title="Rubik's Cube Camera Solver",
    version="1.0.0",
    lifespan=lifespan,
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# REQUEST MODELS
# --------------------------------------------------

class SolveRequest(BaseModel):
    faces: dict


class SolveResponse(BaseModel):
    cube_string: str
    solution: str
    moves: list[str]
    move_count: int


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/")
def root():

    return {
        "message": "Rubik's Cube Solver API is running.",
        "solver": "rubik-solver-py",
    }


@app.get("/health")
def health():

    return {
        "status": "ok"
    }


# --------------------------------------------------
# SOLVE
# --------------------------------------------------

@app.post("/solve", response_model=SolveResponse)
def solve(request: SolveRequest):

    try:

        cube_string = faces_to_cube_string(request.faces)

        solution = solve_cube(cube_string)

        if solution:
            moves = solution.split()
        else:
            moves = []

        return SolveResponse(
            cube_string=cube_string,
            solution=solution,
            moves=moves,
            move_count=len(moves),
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:

        print("Solver error:", error)

        raise HTTPException(
            status_code=500,
            detail="An unexpected solver error occurred.",
        )