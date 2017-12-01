// @flow

jest.mock("wrtc", () => require("../../../mocks/vendor/wrtc.mock"));

import RTCPeer from "../../../../src/client/provider/web-rtc/rtc-peer";

import {
  RTCPeerConnection,
  RTCSessionDescription
} from "../../../mocks/vendor/wrtc.mock";

describe("RTCPeer", () => {
  let onChannel;
  let onClose;
  let onICE;
  let peerConnection;
  let peer;

  beforeEach(() => {
    onChannel = jest.fn();
    onClose = jest.fn();
    onICE = jest.fn();
    peerConnection = new RTCPeerConnection();
    peer = new RTCPeer({
      peerConnection,
      onChannel,
      onClose,
      onICE
    });
  });

  describe("channel()", () => {
    it("resolves with a Connection when underlying datachannel opens", async () => {
      const connect = peer.channel("foo");

      // Trigger "open" by setting the remote/local description of
      // the mock manually.
      peerConnection.setLocalDescription(
        new RTCSessionDescription({ sdp: "", type: "offer" })
      );
      peerConnection.setRemoteDescription(
        new RTCSessionDescription({ sdp: "", type: "answer" })
      );

      const connection = await connect;

      expect(connection).toBeTruthy();
    });

    it("emits DataChannel when underlying datachannel opens", async () => {
      const connect = peer.channel("foo");

      // Trigger "open" by setting the remote/local description of
      // the mock manually.
      peerConnection.setLocalDescription(
        new RTCSessionDescription({ sdp: "", type: "offer" })
      );
      peerConnection.setRemoteDescription(
        new RTCSessionDescription({ sdp: "", type: "answer" })
      );

      const connection = await connect;

      expect(onChannel).toHaveBeenCalledWith(connection);
    });
  });

  it("emits ICE data", () => {
    const candidate = {
      candidate: ""
    };

    peerConnection.__triggerIceCandidate__({
      candidate
    });

    expect(onICE).toHaveBeenCalledWith(candidate);
  });
});
