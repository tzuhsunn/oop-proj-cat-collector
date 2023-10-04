import matplotlib.pyplot as plt
# plot loss curve
def plot_loss_curve(history):
    plt.cla()
    train_losses = [x.get('train_loss') for x in history]
    val_losses = [x.get('valid_loss') for x in history]
    plt.plot(train_losses, '-bx',label='train')
    plt.plot(val_losses, '-rx',label='valid')
    plt.xlabel('epoch')
    plt.ylabel('loss')
    plt.title('Loss vs. No. of epochs')
    plt.legend()
    plt.savefig('loss_curve.png')
# plot accuracy curve
def plot_accuracy_curve(history):
    plt.cla()
    psnrs = [x.get('accuracy') for x in history]
    plt.plot(psnrs, '-bx')
    plt.xlabel('epoch')
    plt.ylabel('accuracy')
    plt.title('accuracy vs. No. of epochs');
    plt.savefig('accuracy.png')
# plot lr curve
def plot_lr_curve(history):
    plt.cla()
    lrs = [x.get('lrs') for x in history]
    plt.plot(lrs, '-bx')
    plt.xlabel('epoch')
    plt.ylabel('lr')
    plt.title('lr vs. No. of epochs');
    plt.savefig('lr_curve.png')