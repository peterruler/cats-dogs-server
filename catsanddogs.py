import tensorflow as tf
from tensorflow import keras
import os
from tensorflow.keras.models import model_from_json
import sys

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# load json and create model
json_file = open('model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)

# load weights into new model
loaded_model.load_weights("model.h5")

# evaluate loaded model on test data
loaded_model.compile(loss='binary_crossentropy', optimizer='rmsprop', metrics=['accuracy'])

def test():
    test_dir = "./uploads"
    i = sys.argv[1]
    img_path = os.path.join(test_dir, '{}'.format(i))
    image_size = (180, 180)
    img = keras.utils.load_img(
       img_path, target_size=image_size
    )
    img_array = keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    predictions = loaded_model.predict(img_array, verbose=0)
    score = float(predictions[0])
    if score > 0.2 and score < 0.8:
        print(f"Bei diesem Bild konnte Tiertyp nicht ermittelt werden! Sind Sie sicher, dass es sich um das Bild eines Hundes oder einer Katze handelt?")
    else :
        print(f"Dieses Bild ist {100 * (1 - score):.2f}% Katze und {100 * score:.2f}% Hund.")
    sys.exit(0)
  
test()
