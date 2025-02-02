# Solana TPU Buffer Simulator

[Solana TPU Buffer](./assets/demo_image.png)

## ✨ Interactive Transaction Processing Unit (TPU) Buffer Visualization

Experience the inner workings of Solana's transaction processing in real-time with this sleek, interactive simulator. Perfect for developers, educators, and blockchain enthusiasts who want to understand how Solana prioritizes and processes transactions.

## 🎯 Key Features

- **Real-time Transaction Simulation** - Watch transactions flow through the TPU buffer
- **Priority-based Queuing** - Visualize how higher-fee transactions get prioritized
- **Dynamic Fee Mechanics** - Experience automatic fee adjustments based on network load
- **Dark Mode Support** - Easy on the eyes, day or night
- **Responsive Design** - Works beautifully on all devices
- **Interactive Controls** - Manual and automatic simulation modes

## 🌟 Live Demo

Try it out: [Live Demo Link](https://solana-tpu-buffer-viz.vercel.app/)

[Demo Video](./assets/demo.gif)

## 🛠️ Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/solana-tpu-simulator.git

# Navigate to project directory
cd solana-tpu-simulator

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📘 Understanding TPU Priority Fees

### How TPU Priority Queue Works

The Transaction Processing Unit (TPU) in Solana processes transactions through several key stages:

#### 1. Initial Processing

- **QUIC Streaming**: Transactions arrive via QUIC streams with stake-based rate limiting
- **Signature Verification**: Deduplication and filtering of invalid signatures
- **Banking Stage**: Determines whether to forward, hold, or process transactions

#### 2. Priority and Processing

- **Base Fee**: Standard fee for network resource usage
- **Priority Fee**: Additional fee for prioritization
- **Stake-Based Access**: Higher staked clients get more concurrent streams and bandwidth
- **Rate Limiting**: PPS (Packets Per Second) limits based on stake weight

#### 3. Queue Management

```
Priority = Base Fee + Priority Fee + (Compute Units × Current Market Rate)
```

The TPU manages transactions through:

- Stake-weighted admission control
- Dynamic load shedding for network stability
- Automatic backpressure during congestion

#### 4. TPU Buffer States

| Buffer State | Utilization | Fee Behavior                 |
| ------------ | ----------- | ---------------------------- |
| Low Load     | 0-50%       | Minimal priority fees needed |
| Medium Load  | 51-75%      | Moderate fee competition     |
| High Load    | 76-90%      | Aggressive fee competition   |
| Congested    | 91-100%     | Maximum fee competition      |

#### 5. Transaction Lifecycle

1. Transaction arrives at TPU
2. Priority score calculated
3. Inserted into priority queue
4. Reordering based on new arrivals
5. Processing based on final priority

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📖 Learn More

- [Solana Documentation](https://docs.solana.com/)
- [TPU Architecture](https://docs.solana.com/validator/tpu)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

---

<p align="center">
  Made with ❤️ for the Solana community
</p>

---
