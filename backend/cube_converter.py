from collections import Counter


# Camera colour names → cube face letters
#
# Standard Rubik's Cube colour scheme:
#
# WHITE  = U
# RED    = R
# GREEN  = F
# YELLOW = D
# ORANGE = L
# BLUE   = B

COLOR_TO_FACE = {
    "WHITE": "U",
    "RED": "R",
    "GREEN": "F",
    "YELLOW": "D",
    "ORANGE": "L",
    "BLUE": "B",
}


VALID_COLORS = set(COLOR_TO_FACE.keys())


def validate_faces(faces: dict):

    required_faces = ["U", "R", "F", "D", "L", "B"]

    for face in required_faces:

        if face not in faces:
            raise ValueError(f"Missing face: {face}")

        stickers = faces[face]

        if not isinstance(stickers, list):
            raise ValueError(
                f"Face {face} must contain a list of stickers."
            )

        if len(stickers) != 9:
            raise ValueError(
                f"Face {face} must contain exactly 9 stickers."
            )

        for colour in stickers:

            if not isinstance(colour, str):
                raise ValueError(
                    f"Invalid colour on face {face}."
                )

            colour = colour.upper()

            if colour not in VALID_COLORS:
                raise ValueError(
                    f"Invalid colour '{colour}' on face {face}."
                )


def faces_to_cube_string(faces: dict) -> str:

    validate_faces(faces)

    order = ["U", "R", "F", "D", "L", "B"]

    cube_string = ""

    for face in order:

        for colour in faces[face]:

            colour = colour.upper()

            cube_string += COLOR_TO_FACE[colour]

    # Every cube must have exactly 9 stickers of each colour.
    counts = Counter(cube_string)

    for face in order:

        if counts[face] != 9:
            raise ValueError(
                f"Invalid colour count for {face}: "
                f"expected 9, found {counts[face]}"
            )

    return cube_string