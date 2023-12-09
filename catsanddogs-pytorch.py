import torch
import torchvision
from torchvision import transforms
from PIL import Image
from os import listdir
import random
import torch.optim as optim
from torch.autograd import Variable
import torch.nn.functional as F
import torch.nn as nn
import sys

device="cuda" if torch.cuda.is_available() else "cpu"

torch.manual_seed(1234)
if device == 'cuda':
    torch.cuda.manual_seed_all(1234)

normalize = transforms.Normalize(
    mean = [0.485, 0.456, 0.406],
    std = [0.229, 0.224, 0.225]
)

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(256),
    transforms.ToTensor(),
    normalize])

# TARGET: [isCat, isDog]
train_data_list = []
target_list = []
train_data = []
files = listdir('catdog/train/')
for i in range(len(listdir('catdog/train/'))) :
    f = random.choice(files)
    files.remove(f)
    img = Image.open("catdog/train/" + f )
    img_tensor = transform(img) #(3,256,256)
    train_data_list.append(img_tensor)

    isCat = 1 if 'cat' in f else 0
    isDog = 1 if 'dog' in f else 0
    target = [isCat,isDog]
    target_list.append(target)

    if len(train_data_list) >= 64:
       train_data.append((torch.stack(train_data_list),target_list))
       train_data_list = []
       target_list = []
       break

class Netz(nn.Module):
    def __init__(self):
        super(Netz,self).__init__()
        self.conv1 = nn.Conv2d(3, 6, kernel_size=5)
        self.conv2 = nn.Conv2d(6, 12, kernel_size=5)
        self.conv3 = nn.Conv2d(12, 18, kernel_size=5) #18*28*28 = 14'000 neurons
        self.conv4 = nn.Conv2d(18, 24, kernel_size=5)
        self.fc1 = nn.Linear(14112, 1000) # 1000 neurons
        self.fc2 = nn.Linear(1000, 2) # 2 neurons cat or dog our output

    def forward(self,x):
        x = self.conv1(x)
        x = F.max_pool2d(x,2)
        x = F.relu(x)

        x = self.conv2(x)
        x = F.max_pool2d(x,2)
        x = F.relu(x)

        x = self.conv3(x)
        x = F.max_pool2d(x,2)
        x = F.relu(x)
        x = x.view(-1, 14112) # nr of neurons
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return F.sigmoid(x) # neither softmax nor log_softmax dont use here use with binary_cross_entropy

model = torch.load('model.pth')
model.load_state_dict(torch.load('model.pt'))
optimizer = optim.Adam(model.parameters(), lr=0.001)
optimizer.load_state_dict(torch.load('optimizer.pt'))

model.to(device) # no gpu on m1 mac, use cpu

optimizer = optim.Adam(model.parameters(), lr=0.001)

def test():
    model.eval();

    img = Image.open('images/' + sys.argv[1]);

    img_eval_tensor = transform(img)
    img_eval_tensor.unsqueeze_(0)
    data = Variable(img_eval_tensor.to(device))
    out = model(data)
    isa = 'Hund'
    if (int(out.data.max(1,keepdim=True)[1].tolist()[0][0]) == 0) :  # dim 1: 0 is Cat - 1 is dog
     isa = 'Katze'
    
    print(isa)

    sys.exit(0)
  
test()